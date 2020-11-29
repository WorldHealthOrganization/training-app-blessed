import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Card } from "../../components/card-board/Card";
import { Cardboard } from "../../components/card-board/Cardboard";
import { MainButton } from "../../components/main-button/MainButton";
import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalParagraph,
    ModalTitle,
} from "../../components/modal";
import { Spinner } from "../../components/spinner/Spinner";
import { useAppContext } from "../../contexts/app-context";

export const HomePage = () => {
    const { setAppState, modules, reload } = useAppContext();
    const [loading, setLoading] = useState(true);

    const loadModule = useCallback(
        (module: string, step: number) => {
            if (step > 0) {
                setAppState({ type: "TRAINING", state: "OPEN", module, step, content: 1 });
            } else {
                setAppState({ type: "TRAINING_DIALOG", dialog: "welcome", module });
            }
        },
        [setAppState]
    );

    const exitTutorial = useCallback(() => {
        setAppState({ type: "EXIT" });
    }, [setAppState]);

    useEffect(() => {
        reload().then(() => setLoading(false));
    }, [reload]);

    return (
        <StyledModal centerChildren={true}>
            <ContentWrapper>
                <ModalTitle>{i18n.t("Here is your progress on DHIS2 training")}</ModalTitle>
                <ModalParagraph>
                    {i18n.t("Select one of these tutorials to continue learning:", {
                        nsSeparator: false,
                    })}
                </ModalParagraph>
                <ModalContent>
                    {loading ? (
                        <SpinnerWrapper>
                            <Spinner />
                        </SpinnerWrapper>
                    ) : (
                        <Cardboard>
                            {modules.map(({ name, id, progress, disabled, contents }, idx) => {
                                const { lastStep, completed } = progress;
                                const percentage = Math.round(
                                    (lastStep / contents.steps.length) * 100
                                );

                                return (
                                    <Card
                                        key={`card-${idx}`}
                                        label={name}
                                        progress={completed ? 100 : percentage}
                                        onClick={() => loadModule(id, completed ? 0 : lastStep + 1)}
                                        disabled={disabled}
                                    />
                                );
                            })}
                        </Cardboard>
                    )}
                </ModalContent>
                <ModalFooter className="modal-footer">
                    <MainButton color="secondary" onClick={exitTutorial}>
                        {i18n.t("Exit Tutorial")}
                    </MainButton>
                </ModalFooter>
            </ContentWrapper>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    ${ModalContent} {
        max-width: none;
        max-height: 500px;
        width: 700px;
        padding: 0px;
        margin: 0px 10px 20px 10px;
    }
`;

const ContentWrapper = styled.div`
    padding: 15px;
`;

const SpinnerWrapper = styled.div`
    height: 150px;
    display: flex;
    place-content: center;
    align-items: center;
`;
