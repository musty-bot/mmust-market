export const conversations = [
  {
    id: 'c1',
    name: 'Brian O.',
    listing: 'HP Laptop 15" i5 8GB',
    last: 'Is it still available?',
    time: '2h',
    unread: 2,
    messages: [
      { from: 'them', text: 'Hi, is the laptop still available?', t: '10:02' },
      { from: 'me', text: 'Yes it is!', t: '10:05' },
      { from: 'them', text: 'Can we meet at main gate?', t: '10:06' },
      { from: 'them', text: 'Is it still available?', t: '10:10' },
    ],
  },
  {
    id: 'c2',
    name: 'Landlord J.',
    listing: 'Single Room near Main Gate',
    last: 'Deposit is 1 month',
    time: '1d',
    unread: 0,
    messages: [
      { from: 'me', text: 'Hello, do you have water?', t: 'Yesterday' },
      { from: 'them', text: 'Deposit is 1 month', t: 'Yesterday' },
    ],
  },
  {
    id: 'c3',
    name: 'Asha M.',
    listing: 'Calculus Textbook',
    last: 'Okay, thanks!',
    time: '3d',
    unread: 0,
    messages: [
      { from: 'them', text: 'Can you do 1000?', t: 'Mon' },
      { from: 'me', text: 'Deal', t: 'Mon' },
      { from: 'them', text: 'Okay, thanks!', t: 'Mon' },
    ],
  },
]
