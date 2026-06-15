const WP_DATA = {
  meName: 'Alex',
  tables: [
    {
      id: 't1',
      name: 'Daniel',
      synced: true,
      paidBy: 'p2',
      paidAt: '2026-06-13T20:30:00',
      people: [
        { id: 'p2', name: 'Daniel', photo: null, amount: 42 },
        { id: 'me', name: 'Me', isMe: true, photo: null, amount: null },
      ],
    },
    {
      id: 't2',
      name: 'Flat dinners',
      synced: true,
      paidBy: 'me',
      paidAt: '2026-06-14T19:00:00',
      people: [
        { id: 'p3', name: 'Noor', photo: null, amount: null },
        { id: 'p4', name: 'Kim', photo: null, amount: 28 },
        { id: 'me', name: 'Me', isMe: true, photo: null, amount: null },
      ],
    },
    {
      id: 't3',
      name: 'Sofia',
      synced: false,
      paidBy: 'p5',
      paidAt: '2026-06-08T13:00:00',
      people: [
        { id: 'p5', name: 'Sofia', photo: null, amount: 16.5 },
        { id: 'me', name: 'Me', isMe: true, photo: null, amount: null },
      ],
    },
  ],
}

export default WP_DATA
