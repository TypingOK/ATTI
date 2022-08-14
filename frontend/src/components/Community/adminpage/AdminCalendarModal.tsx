import React, { useEffect, useState } from "react";
import { weekClassAttend } from "./AdminAttendance";
import AdminAttendStudentList from "./AdminAttendStudentList";
import {
  AdminAttendButton,
  AdminAttendClassLi,
  AdminAttendClassUl,
  AdminAttendLeftWrapper,
  AdminAttendModalWrapper,
  AdminAttendTemp,
  AdminAttendTime,
  AdminAttendTimerWrapper,
  AdminAttendTimeWrapper,
} from "./adminStyle/AdminCalendarModalInputstyled";
import { palette } from "../../../styles/palette";
import { TextWrapper } from "../schedule/SchedulePageStyle";

export interface studentAttendState {
  name: string;
  attend: string;
}
export interface classStudentList {
  courseId: number;
  className: string;
  class: studentAttendState[];
}

const dummyClass = [
  {
    courseId: "1",
    courseName: "Spring Boot",
    courseProf: "이현태",
    courseStartTime: "2022-08-12 09:00",
    courseEndTime: "2022-08-12 12:00",
    courseDate: "2022-08-12",
  },
  {
    courseId: "2",
    courseName: "운영체제",
    courseProf: "이현태",
    courseStartTime: "2022-08-12 14:00",
    courseEndTime: "2022-08-12 16:00",
    courseDate: "2022-08-12",
  },
  {
    courseId: "3",
    courseName: "React",
    courseProf: "이현태",
    courseStartTime: "2022-08-12 16:00",
    courseEndTime: "2022-08-12 18:00",
    courseDate: "2022-08-12",
  },
];

const time = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
const AdminCalendarModal = () => {
  const [classList, setClassList] = useState<weekClassAttend[] | undefined>(
    undefined
  );
  const [courseName, setCourseName] = useState<string>("");
  const [courseId, setCourseId] = useState<number>(0);
  const [dayClassList, setDayClassList] = useState<any>();
  useEffect(() => {
    let temp = dummyClass.map((e) => {
      e.courseStartTime = e.courseStartTime.slice(11);
      e.courseEndTime = e.courseEndTime.slice(11);
      return e;
    });
    let dayClass = new Array(9).fill({
      courseId: "",
      courseName: "",
      courseProf: "",
      courseStartTime: "",
      courseEndTime: "",
      courseDate: "",
    });
    for (let i = 0; i < time.length; i++) {
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].courseStartTime.slice(0, 2) === time[i]) {
          dayClass[i] = temp[j];
        }
      }
    }

    console.log(dayClass);
    setClassList(temp);
    setDayClassList(dayClass);
  }, []);

  const handlerStudentList = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.target instanceof Element) {
      setCourseName((e.target as HTMLButtonElement).value);
      setCourseId(Number((e.target as HTMLBRElement).id));
    }
  };

  function calcColor(index: number) {
    const result = index % 5;
    if (result === 0) {
      return palette.pink_1;
    } else if (result === 1) {
      return palette.blue_1;
    } else if (result === 2) {
      return palette.green_1;
    } else if (result === 3) {
      return palette.purple_1;
    } else if (result === 4) {
      return palette.yellow_1;
    }
  }

  function calcColor4(index: number) {
    const result = index % 5;
    if (result === 0) {
      return palette.pink_4;
    } else if (result === 1) {
      return palette.blue_4;
    } else if (result === 2) {
      return palette.green_4;
    } else if (result === 3) {
      return palette.purlue_4;
    } else if (result === 4) {
      return palette.yellow_4;
    }
  }

  return (
    <AdminAttendModalWrapper>
      <AdminAttendLeftWrapper>
        <AdminAttendTimerWrapper>
          {Object.keys(time).map((e: any, i: number) => (
            <AdminAttendTime key={i}>{time[e]}</AdminAttendTime>
          ))}
        </AdminAttendTimerWrapper>
        <AdminAttendTimeWrapper>
          <AdminAttendClassUl>
            {classList !== undefined &&
              Object.keys(dayClassList).map((e: any, i: number) => (
                <AdminAttendClassLi key={i}>
                  {dayClassList[e].courseId !== "" ? (
                    <AdminAttendButton
                      onClick={handlerStudentList}
                      value={dayClassList[e].courseName}
                      id={dayClassList[e].courseId?.toString()}
                      extendsHeight={
                        Number(dayClassList[e].courseEndTime.substring(0, 2)) -
                        Number(dayClassList[e].courseStartTime.substring(0, 2))
                      }
                      calcColor={calcColor(i)}
                    >
                      <TextWrapper calcColor={calcColor4(i)}>
                        <div>{dayClassList[e].courseName}</div>
                        <div>
                          {dayClassList[e].courseStartTime}~
                          {dayClassList[e].courseEndTime}
                        </div>
                      </TextWrapper>
                    </AdminAttendButton>
                  ) : (
                    <AdminAttendTemp></AdminAttendTemp>
                  )}
                </AdminAttendClassLi>
              ))}
          </AdminAttendClassUl>
        </AdminAttendTimeWrapper>
      </AdminAttendLeftWrapper>
      <div>
        <AdminAttendStudentList courseName={courseName} courseId={courseId} />
      </div>
    </AdminAttendModalWrapper>
  );
};

export default AdminCalendarModal;
