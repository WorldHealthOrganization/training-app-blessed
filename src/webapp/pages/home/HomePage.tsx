import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { BigCard } from "../../components/card-board/BigCard";
import { Cardboard } from "../../components/card-board/Cardboard";
import { Modal, ModalContent, ModalParagraph, ModalTitle } from "../../components/modal";
import { Spinner } from "../../components/spinner/Spinner";
import { useAppContext } from "../../contexts/app-context";

export const HomePage = () => {
    const { setAppState, modules, reload, hasSettingsAccess, translate } = useAppContext();

    const [loading, setLoading] = useState(true);

    const loadModule = useCallback(
        (module: string, step: number) => {
            if (step > 1) {
                setAppState({ type: "TRAINING", state: "OPEN", module, step, content: 1 });
            } else {
                setAppState({ type: "TRAINING_DIALOG", dialog: "welcome", module });
            }
        },
        [setAppState]
    );

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    const minimize = useCallback(() => {
        setAppState(appState => ({ ...appState, minimized: true }));
    }, [setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    useEffect(() => {
        reload().then(() => setLoading(false));
    }, [reload]);

    return (
        <React.Fragment>
            <StyledModal
                onSettings={hasSettingsAccess ? openSettings : undefined}
                onMinimize={minimize}
                onClose={exitTutorial}
                centerChildren={true}
            >
                <ContentWrapper>
                    <LogoContainer>
                        <img src="img/logo-dhis.svg" alt="DHIS2" />
                        <img src="img/logo-who.svg" alt="World Health Organization" />
                    </LogoContainer>

                    <ModalTitle bold={true} big={true}>
                        {i18n.t("Welcome to training on DHIS2")}
                    </ModalTitle>
                    <ModalParagraph size={28} align={"left"}>
                        {i18n.t("What do you want to learn in DHIS2?")}
                    </ModalParagraph>

                    <ModalContent>
                        {loading ? (
                            <SpinnerWrapper>
                                <Spinner />
                            </SpinnerWrapper>
                        ) : (
                            <Cardboard rowSize={3}>
                                {modules
                                    .filter(module => module.installed === true)
                                    .map(({ name, id, icon, progress, disabled, contents }, idx) => {
                                        const { lastStep, completed } = progress;
                                        const percentage = Math.round((lastStep / contents.steps.length) * 100);

                                        const handleClick = () => {
                                            loadModule(id, completed ? 0 : lastStep + 1);
                                        };

                                        return (
                                            <BigCard
                                                key={`card-${idx}`}
                                                label={translate(name)}
                                                progress={completed ? 100 : percentage}
                                                onClick={handleClick}
                                                disabled={disabled}
                                                icon={<img src={icon} alt={`Icon for ${name}`} />}
                                            />
                                        );
                                    })}
                            </Cardboard>
                        )}
                    </ModalContent>
                </ContentWrapper>
            </StyledModal>
        </React.Fragment>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    ${ModalContent} {
        max-width: none;
        max-height: 55vh;
        width: 60vw;
        padding: 0px;
        margin: 0px 10px 20px 10px;
    }

    ${ModalTitle} {
        margin: 20px 20px 45px;
    }
`;

const ContentWrapper = styled.div`
    padding: 15px;
`;

const SpinnerWrapper = styled.div`
    height: 150px;
    display: flex;
    place-content: center;
    align-items: center;
`;

const LogoContainer = styled.div`
    img {
        margin: 0 30px;
        user-drag: none;
    }
`;
