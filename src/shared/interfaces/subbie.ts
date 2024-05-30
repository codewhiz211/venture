//statuses in DB are different from the display ones.
//There two objects can help convert statuses in DB to display ones.

const StandardStatus = {
  created: 'TBC',
  scheduled: 'SCHEDULED',
  completed: 'COMPLETED',
};

const RemedialStatus = {
  created: 'TBC',
  ready: 'READY',
  completed: 'COMPLETE - PENDING',
  verified: 'COMPLETED',
};

export { StandardStatus, RemedialStatus };
