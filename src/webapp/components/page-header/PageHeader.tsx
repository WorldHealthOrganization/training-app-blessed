import { ButtonProps, Icon, IconButton, Tooltip } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import Typography from "@material-ui/core/Typography";
import { DialogButton } from "@eyeseetea/d2-ui-components";
import React, { ReactNode } from "react";
import styled from "styled-components";
import i18n from "../../../locales";

export const PageHeader: React.FC<PageHeaderProps> = ({
    className,
    variant = "h5",
    title,
    onBackClick,
    help,
    helpSize = "sm",
    children,
}) => {
    return (
        <div className={className}>
            {!!onBackClick && (
                <BackIconButton
                    onClick={onBackClick}
                    color="secondary"
                    aria-label={i18n.t("Back")}
                    data-test={"page-header-back"}
                >
                    <Icon color="primary">arrow_back</Icon>
                </BackIconButton>
            )}

            <Title variant={variant} gutterBottom data-test={"page-header-title"}>
                {title}
            </Title>

            {help && (
                <DialogButton
                    buttonComponent={HelpButton}
                    title={i18n.t("Help")}
                    maxWidth={helpSize}
                    fullWidth={true}
                    contents={help}
                />
            )}
            {children}
        </div>
    );
};

export interface PageHeaderProps {
    className?: string;
    variant?: Variant;
    title: string;
    onBackClick?: () => void;
    help?: ReactNode;
    helpSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

const HelpButton = ({ onClick }: ButtonProps) => (
    <Tooltip title={i18n.t("Help")}>
        <HelpIconButton onClick={onClick}>
            <Icon color="primary">help</Icon>
        </HelpIconButton>
    </Tooltip>
);

const BackIconButton = styled(IconButton)`
    padding-top: 10px;
    margin-bottom: 5px;
`;

const HelpIconButton = styled(IconButton)`
    margin-bottom: 8px;
`;

const Title = styled(Typography)`
    display: inline-block;
    font-weight: 300;
`;
