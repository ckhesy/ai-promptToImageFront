const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
  'POST /api/v1/optimizePrompt/': (req: any, res: any) => {
    res.json({
      success: true,
      data: `new Prompt is : ${req.body.text} ------!`,
      errorCode: 0,
    });
  },
  'POST /api/v1/getPromptImage/': (req: any, res: any) => {
    res.json({
      success: true,
      data: 'https://thefusioneer.com/wp-content/uploads/2023/11/5-AI-Advancements-to-Expect-in-the-Next-10-Years-scaled.jpeg',
      errorCode: 0,
    });
  },
};
