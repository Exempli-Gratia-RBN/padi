export const platformSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['name', 'price'],
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', maxLength: 24, minLength: 24 },
    },
  },
};

export const transactionSchema = {
  body: {
    type: 'object',
    properties: {
      platform_id: { type: 'string', maxLength: 24, minLength: 24 },
      amount: { type: 'number' },
    },
    required: ['platform_id', 'amount'],
  },
};

export const transactionCallbackSchema = {
  body: {
    type: 'object',
    properties: {
      external_id: { type: 'string' },
      status: { type: 'string' },
    },
    required: ['external_id', 'status'],
  },
};
