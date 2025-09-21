import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Series,
  Audio,
  Img,
  spring,
  Sequence
} from "remotion";
import { fade } from "@remotion/transitions/fade";
import {
  linearTiming,
  TransitionSeries
} from "@remotion/transitions";
const Title = ({ text, textColor, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    fps,
    frame,
    config: {
      damping: 100,
      stiffness: 200
    }
  });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  return /* @__PURE__ */ jsxDEV("h1", { style: {
    fontFamily,
    color: textColor,
    fontSize: "140px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 40px",
    opacity,
    transform: `scale(${scale})`
  }, children: text }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 35,
    columnNumber: 9
  });
};
const ScriptLine = ({ text, textColor, fontFamily }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0]
  );
  const translateY = interpolate(frame, [0, 15], [50, 0]);
  return /* @__PURE__ */ jsxDEV("p", { style: {
    fontFamily,
    color: textColor,
    fontSize: "90px",
    textAlign: "center",
    margin: "0 60px",
    opacity,
    transform: `translateY(${translateY}px)`
  }, children: text }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 62,
    columnNumber: 9
  });
};
const ProjectShowcase = ({ projectInfo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    fps,
    frame,
    from: 0.9,
    to: 1,
    config: { stiffness: 100 }
  });
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  return /* @__PURE__ */ jsxDEV("div", { style: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    opacity,
    transform: `scale(${scale})`
  }, children: [
    /* @__PURE__ */ jsxDEV(
      Img,
      {
        src: projectInfo.imageUrl,
        style: {
          width: "80%",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV("h2", { style: {
      fontSize: "70px",
      color: "#fff",
      textAlign: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: "10px 30px",
      borderRadius: "15px",
      maxWidth: "90%"
    }, children: projectInfo.title }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 108,
      columnNumber: 14
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 91,
    columnNumber: 9
  });
};
const CreatorInfo = ({ projectInfo, textColor }) => {
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { top: "auto", bottom: 120, height: "auto" }, children: /* @__PURE__ */ jsxDEV("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "15px",
    borderRadius: "50px",
    margin: "0 auto",
    maxWidth: "fit-content"
  }, children: [
    /* @__PURE__ */ jsxDEV(Img, { src: projectInfo.creatorAvatarUrl, style: { width: 60, height: 60, borderRadius: "50%" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "50px", color: textColor, fontWeight: "bold" }, children: [
      "@",
      projectInfo.creator
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 138,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 126,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 125,
    columnNumber: 9
  });
};
const ReelComposition = ({ title, script, callToAction, visualStyle, projectInfo }) => {
  const { backgroundColor, textColor, fontFamily } = visualStyle;
  const musicUrl = "/uplifting_music.mp3";
  const DURATION = 60;
  const TRANSITION_DURATION = 15;
  const seriesChildren = [];
  seriesChildren.push(
    /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: DURATION, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(Title, { text: title, textColor, fontFamily }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 160,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 159,
      columnNumber: 13
    }) }, "title-seq", false, {
      fileName: "<stdin>",
      lineNumber: 158,
      columnNumber: 9
    })
  );
  if (script && script.length > 0) {
    seriesChildren.push(/* @__PURE__ */ jsxDEV(TransitionSeries.Transition, { timing: linearTiming({ durationInFrames: TRANSITION_DURATION }), presentation: fade() }, "title-trans", false, {
      fileName: "<stdin>",
      lineNumber: 167,
      columnNumber: 29
    }));
    script.forEach((line, index) => {
      seriesChildren.push(
        /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: DURATION, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(ScriptLine, { text: line, textColor, fontFamily }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 171,
          columnNumber: 21
        }) }, `script-seq-${index}`, false, {
          fileName: "<stdin>",
          lineNumber: 170,
          columnNumber: 17
        })
      );
      if (index < script.length - 1) {
        seriesChildren.push(/* @__PURE__ */ jsxDEV(TransitionSeries.Transition, { timing: linearTiming({ durationInFrames: TRANSITION_DURATION }), presentation: fade() }, `script-trans-${index}`, false, {
          fileName: "<stdin>",
          lineNumber: 178,
          columnNumber: 37
        }));
      }
    });
  }
  seriesChildren.push(/* @__PURE__ */ jsxDEV(TransitionSeries.Transition, { timing: linearTiming({ durationInFrames: TRANSITION_DURATION }), presentation: fade() }, "script-showcase-trans", false, {
    fileName: "<stdin>",
    lineNumber: 184,
    columnNumber: 25
  }));
  seriesChildren.push(
    /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: DURATION * 2, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(ProjectShowcase, { projectInfo }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 188,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 187,
      columnNumber: 13
    }) }, "showcase-seq", false, {
      fileName: "<stdin>",
      lineNumber: 186,
      columnNumber: 9
    })
  );
  seriesChildren.push(/* @__PURE__ */ jsxDEV(TransitionSeries.Transition, { timing: linearTiming({ durationInFrames: TRANSITION_DURATION }), presentation: fade() }, "showcase-cta-trans", false, {
    fileName: "<stdin>",
    lineNumber: 194,
    columnNumber: 25
  }));
  seriesChildren.push(
    /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: DURATION, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(Title, { text: callToAction, textColor, fontFamily }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 198,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 197,
      columnNumber: 13
    }) }, "cta-seq", false, {
      fileName: "<stdin>",
      lineNumber: 196,
      columnNumber: 9
    })
  );
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor }, children: [
    /* @__PURE__ */ jsxDEV(Audio, { src: musicUrl, loop: true, volume: 0.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 206,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(TransitionSeries, { children: seriesChildren }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 207,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360 - DURATION - 15, children: /* @__PURE__ */ jsxDEV(CreatorInfo, { projectInfo, textColor }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 211,
      columnNumber: 18
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 210,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 205,
    columnNumber: 9
  });
};
export {
  ReelComposition
};
