export function rawCourseDataToJsonArray(data) {
  const courseCodeRegex = /^[A-Z]{4}[0-9]{3}/;
  const courseTitleRegex = /^[A-Z][a-z]{2}/;
  const prereqRegex = /^P/;
  const complexPrereqRegex = /^P\s[(]/;
  const schoolRegex = /^S\s.+/;
  const trimesterRegex = /^T/; // FIXME: Must follow by number(s)

  var courseArray = []; // Empty array for course JSON OBJECTS
  // Create a LEVEL100 as the Dummy Root Node for the DAG diagram
  courseArray.push(
    // Push the JSON version of the LEVEL100 node
    JSON.parse(
      '{"id":"level100","courseTitle":["level100 Info"],"parentIds": [],"parentIdsComplex":[],"specificPrereq":"","trimester":["0"],"layer":0}'
    )
  );

  const lines = data.split(/\r\n|\n/); //Split whole data string into array of line strings
  let linesIterator = lines[Symbol.iterator](); // Let the lines array iterable

  linesIterationLoop: while (true) {
    var courseCode, courseTitle, school, trimester, availability;
    var prerequisites = new Array(); //empty array with length 0
    var complexPrereq = new Array();
    var specificPrereq = "";
    var line = linesIterator.next(); // Read each line/update to the next line (This will skip the lines that not match any of our Regex)

    // 0. If EOF, stop
    if (line.done) {
      // console.log("###Parsing finished###");
      break linesIterationLoop;
    }

    // 1. If line is a course code
    if (courseCodeRegex.test(line.value)) {
      courseCode = line.value;
      // console.log("courseCode:" + courseCode);
      line = linesIterator.next(); // Move to the next line
    }

    // 2. Same as above but for title
    if (courseTitleRegex.test(line.value)) {
      courseTitle = line.value;
      // console.log("courseTitle:" + courseTitle);
      line = linesIterator.next();
    }

    // 3. While a line is a prerequisite
    while (prereqRegex.test(line.value)) {
      // FIXME: FOR EACH LINE, Remove unnecessary punctuation marks (such as ; in "P STAT392;"")
      var prereqLine = line.value; // 3.1  Create a prereqLine variable to further parse
      if (prereqLine.length == 1) {
        // 3.2 If the course has no prereq
        prerequisites.push("level100"); // 3.2.1 Let the root "level100" be its prereq
      } else if (
        // 3.3 Complex prerequisites
        complexPrereqRegex.test(prereqLine) || // 3.3.1 If prereqLine contains bracket
        prereqLine.length < 9 || // 3.3.2 If prereqLine does not like the regular (e.g. "P CGRA251"), but something like BEadm/HoS
        !/P\s[A-Z]{4}[0-9]{3}/.test(prereqLine) // 3.3.3 If do not contains any pattern like ("P ENGR101")
      ) {
        // 3.4 Remove P and split with space we have a clean line
        const cleanPrereqLine = prereqLine.replace(/P\s/, "");
        if (complexPrereqRegex.test(prereqLine)) {
          // 3.5 Extract course code from complex prereq
          const rawPrereqTokensArray = cleanPrereqLine.split(/\s/);
          const extractedCourseArray =
            extractComplexPrereq(rawPrereqTokensArray);
          complexPrereq.push(extractedCourseArray); // FIXME:那些只有复杂必修课的课parentIds是空的，找到一个方法让课程正确显示.
        }
        // 3.6 If it not contains any brackets therefore it must have some specific requriements (e.g. "60 300-level pts")
        else if (!complexPrereqRegex.test(prereqLine)) {
          specificPrereq = cleanPrereqLine;
        }
      }
      // 3.7 Normal one prerequisite line. NOTE: EACH LINE ONLY CONTIANS ONE NORMAL COURSE CODE!
      else if (prereqLine.length > 2) {
        prerequisites.push(line.value.replace(/P\s/, "")); // 3.6.1 Remove the [P with space]
      }
      line = linesIterator.next();
    }

    // 4. Read school
    if (schoolRegex.test(line.value)) {
      school = line.value.replace(/S\s/, "");
      // console.log("school:" + school);
      line = linesIterator.next();
    }

    // 5. Read trimister and Terminate by createing a course.
    if (trimesterRegex.test(line.value)) {
      trimester = line.value.replace(/T\s/, "");
      if (!/[1-3]/.test(trimester)) {
        // FIXME: if no specify trimister
        trimester = "1";
        availability = "n";
      } else {
        availability = "y";
      }

      //6. Assigning Level/Layer of each course

      // go through each node
      var nLevel = courseCode.match(/\d/); //Finds first digit - Level
      var nTri = trimester; // Finds trimester - 1 or 2
      var levelAndTri = parseInt(nLevel + nTri);
      var layer;
      // Assign the course depends on their level/trimester
      switch (levelAndTri) {
        case 10: // For "level100 root node only TODO: fix it"
          layer = 0;
          break;
        case 11:
          layer = 1;
          break;
        case 12:
          layer = 2;
          break;
        case 21:
          layer = 3;
          break;
        case 22:
          layer = 4;
          break;
        case 31:
          layer = 5;
          break;
        case 32:
          layer = 6;
          break;
        case 41:
          layer = 7;
          break;
        case 42:
          layer = 8;
          break;
      }

      //  if( !courseArray.some((eachCourse) => eachCourse.id === courseCode) // prevent duplicate course id in the array)
      // 7. Create the course JSON
      var courseJsonObj = {
        id: courseCode,
        courseTitle: courseTitle,
        parentIds: prerequisites,
        parentIdsComplex: complexPrereq,
        specificPrereq: specificPrereq,
        school: school,
        availability: availability,
        trimester: trimester,
        layer: layer,
      };
      courseArray.push(courseJsonObj);
    }
  }

  return courseArray;
}

function extractComplexPrereq(arr) {
  if (arr[0] === "(") {
    arr.shift(); // remove "("
    var operator = arr[0]; // get "1of,2of etc."
    arr.shift(); //remove "1of,2of..."
    var list = [];
    while (arr[0] !== ")") {
      list.push(extractComplexPrereq(arr));
    }
    arr.shift(); // remove ")"
    //  Use a variable for a property name, can use Computed Property Names->[operator]:list.
    var jsonListWithOperator = JSON.parse(JSON.stringify({ [operator]: list }));

    return jsonListWithOperator;
  } else {
    return arr.shift(); // A course code!
  }
}
