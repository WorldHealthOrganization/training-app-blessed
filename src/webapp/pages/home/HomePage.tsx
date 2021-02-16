import { Icon } from "@material-ui/core";
import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Card } from "../../components/card-board/Card";
import { Cardboard } from "../../components/card-board/Cardboard";
import { ContextualMenu } from "../../components/contextual-menu/ContextualMenu";
import { MainButton } from "../../components/main-button/MainButton";
import { Modal, ModalContent, ModalFooter, ModalParagraph, ModalTitle } from "../../components/modal";
import { Spinner } from "../../components/spinner/Spinner";
import { useAppContext } from "../../contexts/app-context";

export const HomePage = () => {
    const { usecases, setAppState, modules, reload, hasSettingsAccess, translate } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [contextMenuTarget, setContextMenuTarget] = useState<{
        id: string;
        pos: number[];
    } | null>(null);

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

    const resetProgress = useCallback(
        async (id: string) => {
            setLoading(true);
            await usecases.progress.update(id, 0);
            await reload();
            setLoading(false);
        },
        [usecases, reload]
    );

    const contextMenuActions = useMemo(() => {
        return [
            {
                name: "reset-progress",
                text: i18n.t("Reset progress"),
                icon: <Icon>refresh</Icon>,
                onClick: resetProgress,
            },
        ];
    }, [resetProgress]);

    useEffect(() => {
        reload().then(() => setLoading(false));
    }, [reload]);

    return (
        <React.Fragment>
            {contextMenuTarget && (
                <ContextualMenu
                    id={contextMenuTarget.id}
                    isOpen={!!contextMenuTarget}
                    actions={contextMenuActions}
                    positionLeft={contextMenuTarget.pos[0] ?? 0}
                    positionTop={contextMenuTarget.pos[1] ?? 0}
                    onClose={() => setContextMenuTarget(null)}
                />
            )}

            <StyledModal
                onSettings={hasSettingsAccess ? openSettings : undefined}
                onMinimize={minimize}
                centerChildren={true}
            >
                <ContentWrapper>
                    <ModalTitle>{i18n.t("Here is your progress on DHIS2 training")}</ModalTitle>
                    <ModalParagraph>
                        {i18n.t("Select one of these tutorials to continue learning:", {
                            nsSeparator: false,
                        })}
                    </ModalParagraph>
                    <ModalContent>
                        {loading ? (
                            <SpinnerWrapper>
                                <Spinner />
                            </SpinnerWrapper>
                        ) : (
                            <Cardboard>
                                {modules
                                    .filter(module => module.installed === true)
                                    .map(({ displayName, id, progress, disabled, contents }, idx) => {
                                        const { lastStep, completed } = progress;
                                        const percentage = Math.round((lastStep / contents.steps.length) * 100);

                                        const handleClick = () => {
                                            loadModule(id, completed ? 0 : lastStep + 1);
                                        };

                                        const handleContextMenu = (event: MouseEvent<unknown>) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            setContextMenuTarget({
                                                id,
                                                pos: [event.clientX, event.clientY],
                                            });
                                        };

                                        const noop = (event: MouseEvent<unknown>) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        };

                                        return (
                                            <Card
                                                key={`card-${idx}`}
                                                label={translate(displayName)}
                                                progress={completed ? 100 : percentage}
                                                onClick={handleClick}
                                                onContextMenu={isDebug ? handleContextMenu : noop}
                                                disabled={disabled}
                                            />
                                        );
                                    })}
                            </Cardboard>
                        )}
                    </ModalContent>
                    <ModalFooter className="modal-footer">
                        <MainButton color="secondary" onClick={exitTutorial}>
                            {i18n.t("Exit Tutorial")}
                        </MainButton>
                    </ModalFooter>
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
        max-height: 500px;
        width: 700px;
        padding: 0px;
        margin: 0px 10px 20px 10px;
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

const isDebug = process.env.NODE_ENV === "development";
