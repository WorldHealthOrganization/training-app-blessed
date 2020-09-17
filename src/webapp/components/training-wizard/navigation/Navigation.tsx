import { WizardNavigationProps } from "d2-ui-components";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { arrayFill } from "../../../../utils/array";
import { MainButton } from "../../main-button/MainButton";
import { NavigationBullet } from "./NavigationBullet";

export const Navigation: React.FC<WizardNavigationProps> = ({
    steps,
    onNext,
    onPrev,
    currentStepKey,
}) => {
    if (steps.length === 0) return null;

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    const { contentIndex = 0, totalContents = 0 } = (currentStep.props as unknown) as any;

    return (
        <ModalFooter>
            <MainButton onClick={onPrev}>{i18n.t("Previous")}</MainButton>
            <ProgressBar>
                {arrayFill(totalContents).map(value => (
                    <NavigationBullet key={value} completed={value === contentIndex} />
                ))}
            </ProgressBar>
            <MainButton onClick={onNext}>{i18n.t("Next")}</MainButton>
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
