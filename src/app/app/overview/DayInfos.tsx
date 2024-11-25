import React from 'react';

interface DayInfo {
  date: Date;
}

const DayInfo: React.FC<DayInfo> = ({ date }) => {
  return (
    <div>
      <h2>Selected Date Details</h2>
      <p>Date: {date.toDateString()}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default DayInfo;