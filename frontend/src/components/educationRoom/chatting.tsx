import styled from "styled-components";

interface chatProps {
  type: string;
  nickname: string;
  data: string;
}

const ChattingDiv = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  border-bottom: 2px solid;
  margin-left: 3px;
  margin-right: 3px;
  background: white;
  height: 100%;
  width: 100%;
`;

const PrivateChattingDiv = styled(ChattingDiv)`
  background: rgba(238, 164, 206, 0.25);
`;

const Chatting = ({ type, nickname, data }: chatProps) => {
  return (
    <div>
      <div>
        {type === "public" ? (
          <ChattingDiv>
            <span>{nickname}님</span>
            <div>
              <span>{data}</span>
            </div>
          </ChattingDiv>
        ) : (
          <PrivateChattingDiv>
            <span>{nickname}님 (1:1)</span>
            <div>
              <span>{data}</span>
            </div>
          </PrivateChattingDiv>
        )}
      </div>
    </div>
  );
};

export default Chatting;
