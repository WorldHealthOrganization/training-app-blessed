import React from "react";
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

export const OverviewPage = () => {
    return (
        <StyledModal>
            <ModalTitle>Here is your progress on DHIS2 training</ModalTitle>
            <ModalParagraph>Select one of these tutorials to continue learning:</ModalParagraph>
            <ModalContent>
                <Cardboard>
                    {[...cards].map(({ name, progress }, idx) => (
                        <Card key={`card-${idx}`} label={name} progress={progress} />
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

const cards = [
    { name: "Basic navigation", progress: 100 },
    { name: "Dashboards", progress: 50 },
    { name: "Data entry", progress: 100 },
    { name: "Event capture", progress: 0 },
    { name: "Chart builder", progress: 80 },
    { name: "Data visualization", progress: 0 },
    { name: "Pivot tables", progress: 80 },
    { name: "Maps", progress: 100 },
    { name: "Bulk Load", progress: 0 },
];
