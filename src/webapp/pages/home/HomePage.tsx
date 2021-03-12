import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { LandingNode } from "../../../domain/entities/LandingPage";
import i18n from "../../../locales";
import { BigCard } from "../../components/card-board/BigCard";
import { Cardboard } from "../../components/card-board/Cardboard";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import { Modal, ModalContent, ModalParagraph, ModalTitle } from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

const Item: React.FC<{
    currentPage: LandingNode;
    isRoot: boolean;
    openPage: (page: LandingNode) => void;
    loadModule: (module: string, step: number) => void;
}> = props => {
    const { currentPage, openPage } = props;

    const { translate, reload } = useAppContext();

    useEffect(() => {
        reload();
    }, [reload]);

    if (currentPage.type === "root") {
        return (
            <React.Fragment>
                <LogoContainer>
                    <img src="img/logo-dhis.svg" alt="DHIS2" />
                    <img src="img/logo-who.svg" alt="World Health Organization" />
                </LogoContainer>
                <ModalTitle bold={true} big={true}>
                    {i18n.t("Welcome to training on DHIS2")}
                </ModalTitle>

                <ModalContent>
                    <ModalParagraph size={28} align={"left"}>
                        {i18n.t("What do you want to learn in DHIS2?")}
                    </ModalParagraph>

                    <Cardboard rowSize={3} key={`group-${currentPage.id}`}>
                        {currentPage.children.map((item, idx) => {
                            return (
                                <BigCard
                                    key={`card-${idx}`}
                                    label={translate(item.name)}
                                    onClick={() => openPage(item)}
                                    icon={
                                        item.icon ? (
                                            <img src={item.icon} alt={`Icon for ${translate(item.name)}`} />
                                        ) : undefined
                                    }
                                />
                            );
                        })}
                    </Cardboard>

                    <AdditionalComponents
                        currentPage={currentPage}
                        isRoot={props.isRoot}
                        loadModule={props.loadModule}
                    />
                </ModalContent>
            </React.Fragment>
        );
    }

    if (currentPage.type === "section") {
        return (
            <GroupContainer>
                <Header>
                    {currentPage.icon ? (
                        <IconContainer>
                            <img src={currentPage.icon} alt={`Page icon`} />
                        </IconContainer>
                    ) : null}

                    <ModalTitle>{translate(currentPage.title ?? currentPage.name)}</ModalTitle>
                </Header>

                <ModalContent>
                    {currentPage.content ? <MarkdownContents source={translate(currentPage.content)} /> : null}
                    {currentPage.children.map(node => (
                        <Item key={`node-${node.id}`} {...props} currentPage={node} />
                    ))}
                    <AdditionalComponents
                        currentPage={currentPage}
                        isRoot={props.isRoot}
                        loadModule={props.loadModule}
                    />{" "}
                </ModalContent>
            </GroupContainer>
        );
    }

    if (currentPage.type === "sub-section") {
        return (
            <GroupContainer>
                <GroupTitle>{translate(currentPage.title ?? currentPage.name)}</GroupTitle>

                {currentPage.content ? <MarkdownContents source={translate(currentPage.content)} /> : null}

                <Cardboard rowSize={5} key={`group-${currentPage.id}`}>
                    {currentPage.children.map((item, idx) => {
                        return (
                            <BigCard
                                key={`card-${idx}`}
                                label={translate(item.name)}
                                onClick={() => openPage(item)}
                                icon={
                                    item.icon ? (
                                        <img src={item.icon} alt={`Icon for ${translate(item.name)}`} />
                                    ) : undefined
                                }
                            />
                        );
                    })}
                </Cardboard>

                <AdditionalComponents currentPage={currentPage} isRoot={props.isRoot} loadModule={props.loadModule} />
            </GroupContainer>
        );
    }

    if (currentPage.type === "category") {
        return (
            <GroupContainer>
                <Header>
                    {currentPage.icon ? (
                        <IconContainer>
                            <img src={currentPage.icon} alt={`Page icon`} />
                        </IconContainer>
                    ) : null}

                    <ModalTitle>{translate(currentPage.title ?? currentPage.name)}</ModalTitle>
                </Header>

                <ModalContent>
                    {currentPage.content ? <MarkdownContents source={translate(currentPage.content)} /> : null}
                    <Cardboard rowSize={5} key={`group-${currentPage.id}`}>
                        {currentPage.children.map((item, idx) => {
                            return (
                                <BigCard
                                    key={`card-${idx}`}
                                    label={translate(item.name)}
                                    onClick={() => openPage(item)}
                                    icon={
                                        item.icon ? (
                                            <img src={item.icon} alt={`Icon for ${translate(item.name)}`} />
                                        ) : undefined
                                    }
                                />
                            );
                        })}
                    </Cardboard>

                    <AdditionalComponents
                        currentPage={currentPage}
                        isRoot={props.isRoot}
                        loadModule={props.loadModule}
                    />
                </ModalContent>
            </GroupContainer>
        );
    }

    return null;
};

const AdditionalComponents: React.FC<{
    isRoot: boolean;
    currentPage: LandingNode;
    loadModule: (module: string, step: number) => void;
}> = ({ isRoot, currentPage, loadModule }) => {
    const { modules, translate, showAllModules } = useAppContext();

    const pageModules = isRoot && showAllModules ? modules.map(({ id }) => id) : currentPage?.modules ?? [];

    return (
        <React.Fragment>
            {isRoot && showAllModules ? (
                <ModalParagraph size={28} align={"left"}>
                    {i18n.t("Select a module below to learn how to use applications in DHIS2:")}
                </ModalParagraph>
            ) : null}

            <Cardboard rowSize={3} key={`group-${currentPage.id}`}>
                {pageModules.map(moduleId => {
                    const module = modules.find(({ id }) => id === moduleId);
                    if (!module) return null;

                    const percentage =
                        module && module.contents.steps.length > 0
                            ? Math.round((module.progress.lastStep / module.contents.steps.length) * 100)
                            : undefined;

                    const handleClick = () => {
                        loadModule(module.id, module.progress.completed ? 0 : module.progress.lastStep + 1);
                    };

                    const name = translate(module.name);

                    return (
                        <BigCard
                            key={`card-${moduleId}`}
                            label={name}
                            progress={module?.progress.completed ? 100 : percentage}
                            onClick={handleClick}
                            disabled={module?.disabled}
                            icon={module?.icon ? <img src={module.icon} alt={`Icon for ${name}`} /> : undefined}
                        />
                    );
                })}
            </Cardboard>
        </React.Fragment>
    );
};

export const HomePage: React.FC = () => {
    const { setAppState, hasSettingsAccess, landings } = useAppContext();

    const [history, updateHistory] = useState<LandingNode[]>([]);

    const openSettings = useCallback(() => {
        setAppState({ type: "SETTINGS" });
    }, [setAppState]);

    const minimize = useCallback(() => {
        setAppState(appState => ({ ...appState, minimized: true }));
    }, [setAppState]);

    const exitTutorial = useCallback(() => {
        setAppState(appState => ({ ...appState, exit: true }));
    }, [setAppState]);

    const openPage = useCallback((page: LandingNode) => {
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

    const currentPage = useMemo<LandingNode | undefined>(() => {
        return history[0] ?? landings[0];
    }, [history, landings]);

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
                {currentPage ? (
                    <Item isRoot={isRoot} loadModule={loadModule} currentPage={currentPage} openPage={openPage} />
                ) : null}
            </ContentWrapper>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 65vw;
    max-height: 80vh;

    ${ModalContent} {
        max-width: 65vw;
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
    display: flex;
    align-items: center;

    img {
        width: 100%;
        height: auto;
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

const MarkdownContents = styled(MarkdownViewer)`
    padding: 0;

    h1 {
        display: block;
        text-align: left;
        font-size: 32px;
        line-height: 47px;
        font-weight: 700;
        margin: 0;
    }
`;
