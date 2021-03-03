import Draggable, { DraggableProps } from "react-draggable";
import styled from "styled-components";

export const DragContainer: React.FC<Partial<DraggableProps> & { className?: string }> = ({
    className,
    children,
    ...rest
}) => {
    return (
        <Container>
            <Draggable {...rest} defaultClassName={className}>
                {children}
            </Draggable>
        </Container>
    );
};

export const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    /* Required to allow clicks on items behind draggable region */
    pointer-events: none;

    /* Required to not loose dragging focus if cursor goes outside of draggable region */
    :active {
        pointer-events: all;
    }
`;
