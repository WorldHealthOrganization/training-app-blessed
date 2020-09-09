import { WizardNavigationProps } from "d2-ui-components";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { MainButton } from "../../main-button/MainButton";
import { NavigationBullet } from "./NavigationBullet";

export const Navigation = ({ steps, onNext, onPrev }: WizardNavigationProps) => {
    if (steps.length === 0) return null;

    return (
        <ModalFooter>
            <span className="modalFooterButtons">
                <MainButton onClick={onPrev}>{i18n.t("Previous")}</MainButton>
                <ProgressBar>
                    {[1, 2, 3, 4].map(value => (
                        <NavigationBullet key={value} completed={value === 2} />
                    ))}
                </ProgressBar>
                <MainButton onClick={onNext}>{i18n.t("Next")}</MainButton>
            </span>
        </ModalFooter>
    );
};

const ModalFooter = styled.div`
    overflow: hidden;
    margin: 20px 0px 20px;
`;

const ProgressBar = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: flex-end;
    width: 25%;
    margin: 0 auto;
    place-content: space-evenly;
`;
