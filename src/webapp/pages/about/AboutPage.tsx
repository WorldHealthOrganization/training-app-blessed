import { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { MarkdownViewer } from "../../components/markdown-viewer/MarkdownViewer";
import { Modal, ModalContent } from "../../components/modal";
import { useAppContext } from "../../contexts/app-context";

export const AboutPage = () => {
    const { setAppState } = useAppContext();

    const contents = [
        `# ${i18n.t("About Training App")}`,
        `#### ${i18n.t("Distributed under GNU GLPv3")}`,
        i18n.t(
            "DHIS2 Training App is a DHIS2 application that aims to provide online training for end users on common processes performed in DHIS2. The application contains generic trainings on data entry, data import, generation of visualizations and creation of dashboards. It also allows administrators to create their own custom tutorials to guide users through specific data collection processes (e.g. completion of specific data collection forms)."
        ),
        i18n.t(
            "This application has been entirely funded by the WHO Global Malaria Programme to support countries using DHIS2 in strengthening the collection and use of health data. The application has been designed by [Lushomo](https://lushomo.net) and developed by [EyeSeeTea SL](http://eyeseetea.com). The source code and release notes can be found at the [WHO GitHub repository](https://github.com/WorldHealthOrganization/training-app-blessed). If you wish to contribute to the development of Training App with new features, please contact [EyeSeeTea](mailto:hello@eyeseetea.com). To continue developing the tool in a coordinated manner please always contact also [WHO](mailto:integrated-data@who.int)",
            { nsSeparator: false }
        ),
    ].join("\n\n");

    const goHome = useCallback(() => {
        setAppState({ type: "HOME" });
    }, [setAppState]);

    return (
        <StyledModal onGoHome={goHome} centerChildren={true}>
            <ModalContent>
                <MarkdownViewer source={contents} center={true} />
                <LogoWrapper>
                    <Logo alt={i18n.t("World Health Organization")} src="img/logo-who.svg" />
                    <Logo alt={i18n.t("EyeSeeTea")} src="img/logo-eyeseetea.png" />
                    <Logo alt={i18n.t("Lushomo")} src="img/logo-lushomo.png" />
                </LogoWrapper>
            </ModalContent>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 65vw;
    max-height: 90vh;

    ${ModalContent} {
        max-width: 65vw;
        max-height: 90vh;
        padding: 0px;
        margin: 0px 10px 20px 10px;
    }

    ${MarkdownViewer} {
        margin-right: 28px;
        text-align-last: unset;
    }
`;

const LogoWrapper = styled.div`
    align-items: center;
`;

const Logo = styled.img`
    width: 200px;
    margin: 0 50px;
`;
