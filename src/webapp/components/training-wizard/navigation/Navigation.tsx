import { WizardNavigationProps } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useCallback } from "react";
import styled from "styled-components";
import { extractStepFromKey } from "../../../../domain/entities/TrainingModule";
import i18n from "../../../../locales";
import { arrayFill } from "../../../../utils/array";
import { MainButton } from "../../main-button/MainButton";
import { NavigationBullet } from "./NavigationBullet";

export const Navigation: React.FC<NavigationProps> = ({
    steps,
    onNext,
    onPrev,
    onMove,
    disableNext,
    disablePrev,
    currentStepKey = "",
}) => {
    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    const prev = useCallback(() => {
        const currentStep = extractStepFromKey(currentStepKey);

        if (currentStep && disablePrev) {
            onMove(currentStep.step - 1, 1);
        } else {
            onPrev();
        }
    }, [onMove, onPrev, currentStepKey, disablePrev]);

    const next = useCallback(() => {
        const currentStep = extractStepFromKey(currentStepKey);

        if (currentStep && disableNext) {
            onMove(currentStep.step + 1, 1);
        } else {
            onNext();
        }
    }, [onMove, onNext, currentStepKey, disableNext]);

    const jump = useCallback(
        (index: number) => {
            const currentStep = extractStepFromKey(currentStepKey);
            if (currentStep) onMove(currentStep.step, index);
        },
        [onMove, currentStepKey]
    );

    if (steps.length === 0 || !currentStep) return null;
    const { contentIndex = 0, totalContents = 0 } = currentStep.props as unknown as any;

    return (
        <ModalFooter>
            {contentIndex - 1 < 0 ? (
                <MainButton onClick={prev}>{i18n.t("Previous step")}</MainButton>
            ) : (
                <MainButton onClick={prev} color="secondary">
                    {i18n.t("Previous")}
                </MainButton>
            )}
            <ProgressBar>
                {totalContents > 1
                    ? arrayFill(totalContents).map(value => (
                          <NavigationBullet
                              key={value}
                              completed={value === contentIndex}
                              onClick={() => jump(value + 1)}
                          />
                      ))
                    : null}
            </ProgressBar>
            {contentIndex + 1 === totalContents ? (
                <MainButton onClick={next}>{i18n.t("Next step")}</MainButton>
            ) : (
                <MainButton onClick={next} color="secondary">
                    {i18n.t("Next")}
                </MainButton>
            )}
        </ModalFooter>
    );
};

export interface NavigationProps extends WizardNavigationProps {
    onMove: (step: number, content: number) => void;
}

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
