import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import ContainerDimensions from "react-container-dimensions";
import ErrorSnackbar from "./ErrorSnackbar";
import MarkdownIt from "markdown-it";
import MarkdownItMusic from "markdown-it-music";
import { useGlobalStateContext } from "./GlobalState";

const COLUMN_GAP = 20;
const MD = new MarkdownIt({ html: true }).use(MarkdownItMusic);

const useStyles = makeStyles((theme) => ({
  columns: {
    columnGap: `${COLUMN_GAP}px`,
    columnRuleWidth: "1px",
    columnRuleStyle: "dashed",
    columnRuleColor: theme.palette.text.secondary,
  },
}));

const MusicMarkdownRender = ({
  source,
  width,
  columnCount,
  transposeAmount,
}) => {
  const theme = useTheme();
  const context = useGlobalStateContext();
  const [html, setHtml] = useState("");
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);

  const handleClearError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  useEffect(() => {
    MD.setTranspose(transposeAmount).setMaxWidth(
      (width - COLUMN_GAP * (columnCount - 1)) / columnCount
    );

    try {
      setHtml(MD.render(source));
      setError(false);
      context.setYouTubeId(MD.meta.youTubeId);
    } catch (err) {
      console.log(err);
      setHtml(`<pre>${source}</pre>`);
      setMessage(err.message);
      setError(true);
    }
  }, [context, source, width, columnCount, transposeAmount]);

  return (
    <>
      <div
        className={`mmd-${theme.palette.type}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ErrorSnackbar
        message={message}
        open={error}
        handleClose={handleClearError}
      />
    </>
  );
};

export default function MusicMarkdown(props) {
  const classes = useStyles();
  return (
    <div className={classes.columns} style={{ columnCount: props.columnCount }}>
      <ContainerDimensions>
        <MusicMarkdownRender {...props} />
      </ContainerDimensions>
    </div>
  );
}
