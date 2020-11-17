import styled from "styled-components";
import { Icon } from "@material-ui/core";
import { getColor } from "../../themes/colors";

export const CardIcon = styled(Icon)`
    float: right;
    background: ${getColor("primary")};
    color: #fff;
    border-radius: 100px;
    padding: 3px;
    font-size: 14px;
`;
