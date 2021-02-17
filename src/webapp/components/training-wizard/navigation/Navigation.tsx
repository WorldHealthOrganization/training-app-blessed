import { WizardNavigationProps } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { arrayFill } from "../../../../utils/array";
import { MainButton } from "../../main-button/MainButton";
import { NavigationBullet } from "./NavigationBullet";

export const Navigation: React.FC<WizardNavigationProps> = ({ steps, onNext, onPrev, currentStepKey }) => {
    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    if (steps.length === 0 || !currentStep) return null;
    const { contentIndex = 0, totalContents = 0 } = (currentStep.props as unknown) as any;

    return (
        <ModalFooter>
            {contentIndex - 1 < 0 ? (
                <MainButton onClick={onPrev}>{i18n.t("Previous step")}</MainButton>
            ) : (
                <MainButton onClick={onPrev} color="secondary">
                    {i18n.t("Previous")}
                </MainButton>
            )}
            <ProgressBar>
                {totalContents > 1
                    ? arrayFill(totalContents).map(value => (
                          <NavigationBullet key={value} completed={value === contentIndex} />
                      ))
                    : null}
            </ProgressBar>
            {contentIndex + 1 === totalContents ? (
                <MainButton onClick={onNext}>{i18n.t("Next step")}</MainButton>
            ) : (
                <MainButton onClick={onNext} color="secondary">
                    {i18n.t("Next")}
                </MainButton>
            )}
        </ModalFooter>
    );
};

const ModalFooter = styled.div`
    overflow: hidden;
    margin: 20px 0px 20px;
    text-align: center;
`;

const ProgressBar = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: flex-end;
    width: 25%;
    margin: 0 auto;
    place-content: space-evenly;
`;
