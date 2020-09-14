import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { TrainingModule } from "../../../../domain/entities/TrainingModule";
import { useAppContext } from "../../../contexts/app-context";
import { ModalContent } from "../../modal/ModalContent";

export const GeneralInfoStep = () => {
    const { usecases } = useAppContext();
    const [module, setModule] = useState<TrainingModule>();

    useEffect(() => {
        usecases.getModule().then(setModule);
    }, [usecases]);

    return (
        <ModalContent>
            {module ? (
                <Markdown source={module.steps[0].contents[0].text} escapeHtml={false} />
            ) : null}
        </ModalContent>
    );
};

const Markdown = styled(ReactMarkdown)`
    color: white;
    padding: 0 20px 0 20px;

    h1 {
        font-size: 36px;
        line-height: 47px;
        font-weight: 300;
        margin: 0px 0px 30px 0px;
    }

    p {
        font-size: 18px;
        font-weight: 300;
        line-height: 28px;
    }

    img {
        width: 100%;
    }
`;
