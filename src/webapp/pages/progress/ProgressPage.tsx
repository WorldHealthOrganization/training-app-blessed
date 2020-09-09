import React from "react";
import styled from "styled-components";
import { MainButton } from "../../components/main-button/MainButton";
import {
    Modal,
    ModalContent,
    ModalFooter,
    ModalParagraph,
    ModalTitle,
} from "../../components/modal";

export const ProgressPage = () => {
    return (
        <StyledModal>
            <ModalContent>
                <ModalTitle>Here is your progress on DHIS2 training</ModalTitle>
                <ModalParagraph>Select one of these tutorials to continue learning:</ModalParagraph>
                <div className="cardBoard">
                    <div className="card done">
                        <span className="cardIcon">
                            <span className="material-icons">done</span>
                        </span>
                        <span className="cardTitle">Basic navigation</span>
                        <span className="percProgress">100%</span>
                        <progress id="cardId1" value="100" max="100"></progress>
                    </div>
                    <div className="card done">
                        <span className="cardIcon">
                            <span className="material-icons">done</span>
                        </span>
                        <span className="cardTitle">Dashboards</span>
                        <span className="percProgress">50%</span>
                        <progress id="cardId2" value="50" max="100"></progress>
                    </div>
                    <div className="card done">
                        <span className="cardIcon">
                            <span className="material-icons">done</span>
                        </span>
                        <span className="cardTitle">Data Entry</span>
                        <span className="percProgress">100%</span>
                        <progress id="cardId3" value="100" max="100"></progress>
                    </div>
                    <div className="card pending">
                        <span className="cardTitle">Event Capture</span>
                        <span className="percProgress">0%</span>
                        <progress id="cardId4" value="0" max="100"></progress>
                    </div>
                    <div className="card">
                        <span className="cardTitle">Chart builder</span>
                        <span className="percProgress">80%</span>
                        <progress id="cardId5" value="80" max="100"></progress>
                    </div>
                </div>
                <div className="cardBoard">
                    <div className="card pending">
                        <span className="cardTitle">Data visualisation</span>
                        <span className="percProgress">0%</span>
                        <progress id="cardId1" value="0" max="100"></progress>
                    </div>
                    <div className="card">
                        <span className="cardTitle">Pivot tables</span>
                        <span className="percProgress">80%</span>
                        <progress id="cardId1" value="80" max="100"></progress>
                    </div>
                    <div className="card done">
                        <span className="cardIcon">
                            <span className="material-icons">done</span>
                        </span>
                        <span className="cardTitle">Maps</span>
                        <span className="percProgress">100%</span>
                        <progress id="cardId1" value="100" max="100"></progress>
                    </div>
                    <div className="card pending">
                        <span className="cardTitle">Bulk Load</span>
                        <span className="percProgress">0%</span>
                        <progress id="cardId1" value="0" max="100"></progress>
                    </div>
                </div>
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
`;
