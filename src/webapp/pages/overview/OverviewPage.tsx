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

export const OverviewPage = () => {
    const { usecases } = useAppContext();
    const [modules, setModules] = useState<{ name: string; progress: number }[]>([]);

    useEffect(() => {
        usecases.listModules().then(setModules);
    }, [usecases]);

    const onClick = useCallback(() => {}, []);

    return (
        <StyledModal>
            <ModalTitle>Here is your progress on DHIS2 training</ModalTitle>
            <ModalParagraph>Select one of these tutorials to continue learning:</ModalParagraph>
            <ModalContent>
                <Cardboard>
                    {modules.map(({ name, progress }, idx) => (
                        <Card
                            key={`card-${idx}`}
                            label={name}
                            progress={progress}
                            onClick={onClick}
                        />
                    ))}
                </Cardboard>
            </ModalContent>
            <ModalFooter className="modal-footer">
                <MainButton color="secondary">Exit Tutorial</MainButton>
            </ModalFooter>
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
