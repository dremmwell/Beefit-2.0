import React from 'react';

interface DayInfo {
  date: Date;
}

const DayInfo: React.FC<DayInfo> = ({ date }) => {
  return (
    <div>
      <p>{date.toDateString()}</p>
    </div>
  );
};

export default DayInfo;