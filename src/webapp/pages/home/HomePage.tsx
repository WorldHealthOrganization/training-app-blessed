import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { LandingNode, LandingPageNode, TempLandingPage } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { BigCard } from "../../components/card-board/BigCard";
import { Cardboard } from "../../components/card-board/Cardboard";
import { Modal, ModalContent, ModalParagraph, ModalTitle } from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

const Item: React.FC<{
    currentPage: LandingNode;
    isRoot?: boolean;
    openPage: (page: LandingPageNode) => void;
    openModule: (module: string, step: number) => void;
}> = props => {
    const { currentPage, isRoot, openModule, openPage } = props;

    const { translate, modules } = useAppContext();

    const rowSize = isRoot || currentPage.type === "module-group" ? 3 : 5;

    if (currentPage.type === "page-group") {
        return (
            <GroupContainer>
                {currentPage.title ? <GroupTitle>{translate(currentPage.title)}</GroupTitle> : null}
                {currentPage.description ? (
                    <GroupDescription>{translate(currentPage.description)}</GroupDescription>
                ) : null}
                <Cardboard rowSize={rowSize} key={`group-${currentPage.id}`}>
                    {currentPage.children.map((item, idx) => {
                        return (
                            <BigCard
                                key={`card-${idx}`}
                                label={translate(item.name)}
                                onClick={() => openPage(item)}
                                icon={<img src={item.icon} alt={`Icon for ${translate(item.name)}`} />}
                            />
                        );
                    })}
                </Cardboard>
            </GroupContainer>
        );
    }

    if (currentPage.type === "module-group") {
        return (
            <GroupContainer>
                {currentPage.title ? <GroupTitle>{translate(currentPage.title)}</GroupTitle> : null}
                {currentPage.description ? (
                    <GroupDescription>{translate(currentPage.description)}</GroupDescription>
                ) : null}
                <Cardboard rowSize={rowSize} key={`group-${currentPage.id}`}>
                    {currentPage.children.map((item, idx) => {
                        const module = modules.find(({ id }) => item.type === "module" && id === item.moduleId);

                        const percentage = module
                            ? Math.round((module.progress.lastStep / module.contents.steps.length) * 100)
                            : undefined;

                        const handleClick = () => {
                            if (module) {
                                openModule(module.id, module.progress.completed ? 0 : module.progress.lastStep + 1);
                            }
                        };

                        return (
                            <BigCard
                                key={`card-${idx}`}
                                label={translate(item.name)}
                                progress={module?.progress.completed ? 100 : percentage}
                                onClick={handleClick}
                                disabled={module?.disabled}
                                icon={<img src={module?.icon} alt={`Icon for ${item.name}`} />}
                            />
                        );
                    })}
                </Cardboard>
            </GroupContainer>
        );
    }

    if (currentPage.type === "page") {
        return (
            <React.Fragment>
                {currentPage.title ? (
                    <Header>
                        {currentPage.icon ? (
                            <IconContainer>
                                <img src={currentPage.icon} alt={`Page icon`} />
                            </IconContainer>
                        ) : null}

                        <ModalTitle>{translate(currentPage.title)}</ModalTitle>
                    </Header>
                ) : null}

                {currentPage.description ? <ModalParagraph>{translate(currentPage.description)}</ModalParagraph> : null}

                <ModalContent>
                    {currentPage.children.map(item => (
                        <Item key={`item-${item.id}`} {...props} currentPage={item}></Item>
                    ))}
                </ModalContent>
            </React.Fragment>
        );
    }

    return null;
};

export const HomePage: React.FC = () => {
    const { setAppState, hasSettingsAccess, modules } = useAppContext();

    const [history, updateHistory] = useState<LandingPageNode[]>([]);

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    const minimize = useCallback(() => {
        setAppState(appState => ({ ...appState, minimized: true }));
    }, [setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    const openPage = useCallback((page: LandingPageNode) => {
        updateHistory(history => [page, ...history]);
    }, []);

    const goBack = useCallback(() => {
        updateHistory(history => history.slice(1));
    }, []);

    const goHome = useCallback(() => {
        updateHistory([]);
    }, []);

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

    const currentPage = useMemo<LandingNode>(() => {
        return (
            history[0] ?? {
                ...TempLandingPage,
                children: [
                    ...TempLandingPage.children,
                    {
                        id: "all-modules",
                        type: "module-group",
                        level: 1,
                        icon: undefined,
                        name: {
                            key: "data-entry-generic-title",
                            referenceValue: "All modules",
                            translations: {},
                        },
                        title: {
                            key: "data-entry-generic-title",
                            referenceValue: "All modules",
                            translations: {},
                        },
                        description: {
                            key: "data-entry-generic-description",
                            referenceValue: "Select a module below to learn how to use applications in DHIS2:",
                            translations: {},
                        },
                        children: modules.map(module => ({
                            id: module.id,
                            type: "module",
                            level: 1,
                            moduleId: module.id,
                            name: module.name,
                            title: undefined,
                            description: undefined,
                            children: undefined,
                            icon: undefined,
                        })),
                    },
                ],
            }
        );
    }, [history, modules]);

    const isRoot = history.length === 0;

    return (
        <StyledModal
            onSettings={hasSettingsAccess ? openSettings : undefined}
            onMinimize={minimize}
            onClose={exitTutorial}
            onGoBack={!isRoot ? goBack : undefined}
            onGoHome={!isRoot ? goHome : undefined}
            centerChildren={true}
        >
            <ContentWrapper>
                {isRoot ? (
                    <React.Fragment>
                        <LogoContainer>
                            <img src="img/logo-dhis.svg" alt="DHIS2" />
                            <img src="img/logo-who.svg" alt="World Health Organization" />
                        </LogoContainer>
                        <ModalTitle bold={true} big={true}>
                            {i18n.t("Welcome to training on DHIS2")}
                        </ModalTitle>
                    </React.Fragment>
                ) : null}

                <Item currentPage={currentPage} isRoot={isRoot} openModule={loadModule} openPage={openPage} />
            </ContentWrapper>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70vw;

    ${ModalContent} {
        max-height: 55vh;
        max-width: 70vw;
        padding: 0px;
        margin: 0px 10px 20px 10px;
    }

    ${ModalTitle} {
        margin: 20px;
    }
`;

const ContentWrapper = styled.div`
    padding: 15px;
`;

const LogoContainer = styled.div`
    img {
        margin: 0 30px;
        user-drag: none;
    }
`;

const IconContainer = styled.div`
    background: #6d98b8;
    margin-right: 30px;
    border-radius: 50%;
    flex-shrink: 0;
    height: 12vh;
    width: 12vh;

    img {
        width: 100%;
        height: auto;
        padding: 10px;
        user-drag: none;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    font-size: 36px;
    line-height: 47px;
    font-weight: 300;
    margin: 40px 0px 30px 50px;
`;

const GroupContainer = styled.div`
    margin-bottom: 20px;
`;

const GroupTitle = styled.span`
    display: block;
    text-align: left;
    font-size: 32px;
    line-height: 47px;
    font-weight: 700;
`;

const GroupDescription = styled.span`
    display: block;
    text-align: left;
    font-size: 24px;
    font-weight: 300;
    line-height: 28px;
    margin: 10px 0px 20px;
`;
