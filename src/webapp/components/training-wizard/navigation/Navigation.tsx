import { WizardNavigationProps } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { arrayFill } from "../../../../utils/array";
import { useAppContext } from "../../../contexts/app-context";
import { MainButton } from "../../main-button/MainButton";
import { NavigationBullet } from "./NavigationBullet";

export const Navigation: React.FC<WizardNavigationProps> = ({
    steps,
    onNext,
    onPrev,
    currentStepKey,
}) => {
    const { setAppState } = useAppContext();

    const index = _(steps).findIndex(step => step.key === currentStepKey);
    const currentStepIndex = index >= 0 ? index : 0;
    const currentStep = steps[currentStepIndex];

    const prev = useCallback(() => {
        if (currentStepIndex > 0) {
            onPrev();
        } else {
            setAppState(appState => {
                if (appState.type !== "TRAINING") return appState;
                return { type: "TRAINING_DIALOG", dialog: "summary", module: appState.module };
            });
        }
    }, [onPrev, setAppState, currentStepIndex]);

    const next = useCallback(() => {
        if (currentStepIndex !== steps.length - 1) {
            onNext();
        } else {
            setAppState(appState => {
                if (appState.type !== "TRAINING") return appState;
                return { type: "TRAINING_DIALOG", dialog: "final", module: appState.module };
            });
        }
    }, [onNext, setAppState, currentStepIndex, steps]);

    if (steps.length === 0) return null;
    const { contentIndex = 0, totalContents = 0 } = (currentStep.props as unknown) as any;

    return (
        <ModalFooter>
            <MainButton onClick={prev}>{i18n.t("Previous")}</MainButton>

            <ProgressBar>
                {totalContents > 1
                    ? arrayFill(totalContents).map(value => (
                          <NavigationBullet key={value} completed={value === contentIndex} />
                      ))
                    : null}
            </ProgressBar>

            <MainButton onClick={next}>{i18n.t("Next")}</MainButton>
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
