import React, { useCallback } from "react";
import styled from "styled-components";
import Decoration from "../../assets/Decoration.png";
import { MainButton } from "../../components/main-button/MainButton";
import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalParagraph,
    ModalTitle,
} from "../../components/modal";
import { Stepper } from "../../components/training-wizard/stepper/Stepper";
import { useAppContext } from "../../contexts/app-context";

export const FinalPage = () => {
    const { setAppState, module } = useAppContext();

    const openSummary = useCallback(() => {
        setAppState(appState => {
            if (appState.type !== "TRAINING_DIALOG") return appState;
            return { type: "TRAINING_DIALOG", module: appState.module, dialog: "summary" };
        });
    }, [setAppState]);

    const exit = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    if (!module) return null;

    const steps = module.contents.steps.map(({ title }, idx) => ({
        key: `step-${idx}`,
        label: title,
        component: () => null,
    }));

    return (
        <StyledModal onClose={exit}>
            <ModalContent bigger={true}>
                <Container>
                    <ModalTitle big={true}>Well done!</ModalTitle>
                    <ModalParagraph>
                        You’ve completed the {module.name.toLowerCase()} tutorial!
                    </ModalParagraph>
                    <Stepper steps={steps} lastClickableStepIndex={-1} markAllCompleted={true} />
                    <ModalFooter>
                        <MainButton onClick={openSummary}>Next</MainButton>
                    </ModalFooter>
                </Container>
            </ModalContent>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    background-image: url(${Decoration});
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    height: 600px;

    ${ModalContent} {
        height: unset;
    }

    ${ModalTitle} {
        font-size: 60px;
    }

    ${ModalParagraph} {
        font-size: 34px;
        line-height: 42px;
        font-weight: 300;
        margin: 25px 0px 15px 0px;
    }

    ${ModalFooter} {
        margin-top: 20px;
    }
`;

const Container = styled.div`
    margin: 12% 18% 0 18%;
`;
