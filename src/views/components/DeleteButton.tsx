import styled from "@emotion/styled";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export const DeleteButtonContainer = styled(IconButton)`
  &:hover {
    color: #ff7f7f;
  }
  padding-bottom: 10px;
`;

export class DeleteButtonProps {
  onClick?: () => void;
}

export default function DeleteButton(props: DeleteButtonProps) {
  return (
    <DeleteButtonContainer onClick={props.onClick}>
      <Delete />
    </DeleteButtonContainer>
  );
}
