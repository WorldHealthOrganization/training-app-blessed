import React from "react";
import styled from "styled-components";
import DataEntryIcon from "../../assets/data-entry/Icon.png";
import { Modal } from "../../components/modal/Modal";
import { ModalContent } from "../../components/modal/ModalContent";
import { MainButton } from "../../components/main-button/MainButton";

export const WelcomePage = () => {
    return (
        <StyledModal>
            <ModalContent>
                <BigTitle>Welcome to the tutorial for Data Entry</BigTitle>
                <Image>
                    <img src={DataEntryIcon} alt="Welcome Illustration" />
                </Image>
                <Paragraph>
                    The data entry application is used to enter data that need to be entered for one
                    location on a regular basis such as weekly, monthy etc. Data is registered for a
                    location, time period and a specific dataset.{" "}
                </Paragraph>
            </ModalContent>
            <Footer>
                <MainButton color="secondary">Exit Tutorial</MainButton>
                <MainButton color="primary">Start Tutorial</MainButton>
            </Footer>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

const BigTitle = styled.span`
    display: block;
    font-size: 48px;
    line-height: 60px;
    font-weight: 300;
    margin: 30px 0px 30px 0px;
`;

const Image = styled.span`
    display: block;
    margin: 18px 0px;
`;

const Paragraph = styled.span`
    display: block;
    font-size: 18px;
    font-weight: 300;
    line-height: 28px;
    margin: 20px 0px;
`;

const Footer = styled.div`
    overflow: hidden;
    margin: 0px 0px 20px;
`;
