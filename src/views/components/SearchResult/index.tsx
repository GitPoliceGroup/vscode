import { useContext, useState } from "react";
import { SearchCodebase } from "../../types";
import { WebviewContext } from "../../WebviewContext";
import {
  getIcon,
  SearchResultCard,
  SearchResultCardActionArea,
  SearchResultCardMenu,
} from "./styles";
import { Box, CardContent, Grow, IconButton, Typography } from "@mui/material";
import { Check, ContentCopy } from "@mui/icons-material";

export default function SearchResult({ result }: { result: SearchCodebase }) {
  const { callApi } = useContext(WebviewContext);

  const [copied, setCopied] = useState(false);
  const [showCopy, setCopy] = useState(false);

  const handleCopy = () => {
    callApi("writeToClipboard", result.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <SearchResultCard
      onMouseOver={() => setCopy(true)}
      onMouseOut={() => setCopy(false)}
    >
      <SearchResultCardActionArea onClick={handleCopy}>
        <CardContent>
          <Box>
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ fontSize: "15px" }}
            >
              {getIcon(result.type) && (
                <IconButton size="small">{getIcon(result.type)}</IconButton>
              )}{" "}
              {result.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.500", align: "right" }}
            >
              {result.url.replace(/https?:\/\//i, "")}
            </Typography>
          </Box>
        </CardContent>
        <SearchResultCardMenu>
          {showCopy && (
            <IconButton
              size="large"
              sx={{ marginBottom: "auto", marginTop: "auto" }}
              onClick={handleCopy}
              color={copied ? "success" : "default"}
            >
              <Grow in={copied}>{copied ? <Check /> : <ContentCopy />}</Grow>
            </IconButton>
          )}
        </SearchResultCardMenu>
      </SearchResultCardActionArea>
    </SearchResultCard>
  );
}
