import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { TrainingModule } from "../../../domain/entities/TrainingModule";
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
import { useAppContext } from "../../contexts/app-context";

export const HomePage = () => {
    const { usecases, setAppState } = useAppContext();
    const [modules, setModules] = useState<TrainingModule[]>([]);

    useEffect(() => {
        usecases.listModules().then(setModules);
    }, [usecases]);

    const loadModule = useCallback(
        (module: string) => {
            setAppState({ type: "TRAINING_DIALOG", dialog: "welcome", module });
        },
        [setAppState]
    );

    const exitTutorial = useCallback(() => {
        setAppState({ type: "EXIT" });
    }, [setAppState]);

    return (
        <StyledModal onClose={exitTutorial}>
            <ContentWrapper>
                <ModalTitle>Here is your progress on DHIS2 training</ModalTitle>
                <ModalParagraph>Select one of these tutorials to continue learning:</ModalParagraph>
                <ModalContent>
                    <Cardboard>
                        {modules.map(({ name, id, progress, disabled }, idx) => (
                            <Card
                                key={`card-${idx}`}
                                label={name}
                                progress={progress}
                                onClick={() => loadModule(id)}
                                disabled={disabled}
                            />
                        ))}
                    </Cardboard>
                </ModalContent>
                <ModalFooter className="modal-footer">
                    <MainButton color="secondary" onClick={exitTutorial}>
                        Exit Tutorial
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
