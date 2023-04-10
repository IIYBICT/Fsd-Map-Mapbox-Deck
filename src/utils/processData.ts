// 处理航迹数据
export const ProcessFlightTrackData = (
  data: {
    start: number[];
    end: number[];
  }[]
) => {
  var startLstLonDiff = [];
  var endLstLonDiff = [];
  const startList: number[][] = [];
  const endList: number[][] = [];
  data.map((item) => {
    startList.push(item.start);
    endList.push(item.end);
  });
  for (var index = 0; index < startList.length - 1; index++) {
    var detLon = startList[index + 1][0] - startList[index][0];
    if (Math.abs(detLon) > 180) {
      if (detLon > 0) {
        detLon -= 360;
      } else {
        detLon += 360;
      }
    }
    startLstLonDiff.push(detLon);
  }
  for (var index = 0; index < endList.length - 1; index++) {
    var detLon = endList[index + 1][0] - endList[index][0];
    if (Math.abs(detLon) > 180) {
      if (detLon > 0) {
        detLon -= 360;
      } else {
        detLon += 360;
      }
    }
    endLstLonDiff.push(detLon);
  }
  for (var index = 0; index < startList.length - 1; index++) {
    startList[index + 1][0] = startList[index][0] + startLstLonDiff[index];
  }
  for (var index = 0; index < endList.length - 1; index++) {
    endList[index + 1][0] = endList[index][0] + endLstLonDiff[index];
  }
};

// 处理计划航路数据
export const ProcessNavigationTrackData = (
  data: {
    start: [string, number, number];
    end: [string, number, number];
  }[]
) => {
  var startLstLonDiff = [];
  var endLstLonDiff = [];
  const startList: [string, number, number][] = [];
  const endList: [string, number, number][] = [];
  data.map((item) => {
    startList.push(item.start);
    endList.push(item.end);
  });
  for (var index = 0; index < startList.length - 1; index++) {
    var detLon = startList[index + 1][1] - startList[index][1];
    if (Math.abs(detLon) > 180) {
      if (detLon > 0) {
        detLon -= 360;
      } else {
        detLon += 360;
      }
    }
    startLstLonDiff.push(detLon);
  }
  for (var index = 0; index < endList.length - 1; index++) {
    var detLon = endList[index + 1][1] - endList[index][1];
    if (Math.abs(detLon) > 180) {
      if (detLon > 0) {
        detLon -= 360;
      } else {
        detLon += 360;
      }
    }
    endLstLonDiff.push(detLon);
  }
  for (var index = 0; index < startList.length - 1; index++) {
    startList[index + 1][1] = startList[index][1] + startLstLonDiff[index];
  }
  for (var index = 0; index < endList.length - 1; index++) {
    endList[index + 1][1] = endList[index][1] + endLstLonDiff[index];
  }
};
