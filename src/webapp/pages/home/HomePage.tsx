import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
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
    const [modules, setModules] = useState<
        { name: string; key: string; progress: number; disabled?: boolean }[]
    >([]);

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
            <ModalContent>
                <ModalTitle>Here is your progress on DHIS2 training</ModalTitle>
                <ModalParagraph>Select one of these tutorials to continue learning:</ModalParagraph>
                <ModalContent>
                    <Cardboard>
                        {modules.map(({ name, key, progress, disabled }, idx) => (
                            <Card
                                key={`card-${idx}`}
                                label={name}
                                progress={progress}
                                onClick={() => loadModule(key)}
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
            </ModalContent>
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
