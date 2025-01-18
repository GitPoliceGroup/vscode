import styled from "@emotion/styled";
import { Box, IconButton, Card, CardActionArea } from "@mui/material";

import { GitHub as GithubIcon } from "@mui/icons-material";
import {
  FaGitlab as GitlabIcon,
  FaBitbucket as BitbucketIcon,
} from "react-icons/fa";
import { SiGitee as GiteeIcon } from "react-icons/si";

export const SearchResultCard = styled(Card)`
  max-width: 100%;
  color: white;
  background-color: #000053;
  margin: 10px 10px;
  border-radius: 10px;
  white-space: pre-line;
`;

export const SearchResultCardActionArea = styled(CardActionArea)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SearchResultCardMenu = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
`;

export const HoverIconButton = styled(IconButton)`
  &:hover {
    color: #aaa;
  }
  padding-bottom: 10px;
`;

export const getIcon = (type: string) => {
  switch (type) {
    case "github":
      return <GithubIcon />;
    case "gitlab":
      return <GitlabIcon />;
    case "bitbucket":
      return <BitbucketIcon />;
    case "gitee":
      return <GiteeIcon />;
    default:
      return null;
  }
};
