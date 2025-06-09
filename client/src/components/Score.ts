interface IGamePayload {
  getPayload(props: any): {
    score: number,
    created_at: Date,
    test_name: string
  };
}

export class RequestBody {
  private strategy: IGamePayload;

  constructor(strategy: IGamePayload) {
    this.strategy = strategy;
  }

  getBody(props: any) {
    return this.strategy.getPayload(props);
  }
}

export class ClickSpeedPayload implements IGamePayload {
  getPayload(props: { clicks: number, elapsed_time: number }) {
    return {
      score: Math.floor((props.clicks / props.elapsed_time) * 100),
      created_at: new Date(),
      test_name: 'click-speed'
    }
  }
}

export class ColorMemoryPaylaod implements IGamePayload {
  getPayload(props: { level: number }) {
    return {
      score: props.level - 1,
      created_at: new Date(),
      test_name: 'color-memory'
    }
  }
}

export class LanguageDexterityPayload implements IGamePayload {
  getPayload(props: { level: number }) {
    return {
      score: props.level,
      created_at: new Date(),
      test_name: 'language-dexterity'
    }
  }
}

export class NumberMemoryPayload implements IGamePayload {
  getPayload(props: { level: number }) {
    return {
      score: props.level - 1,
      created_at: new Date(),
      test_name: 'number-memory'
    }
  }
}

export class TimePerceptionPayload implements IGamePayload {
  getPayload({ start_time, click_time, target_time }: { start_time: number, click_time: number, target_time: number }) {
    console.log(start_time, click_time, target_time);

    const time_diff = Math.abs(click_time - target_time);
    console.log(time_diff);
    return {
      score: Math.max(10000 - time_diff, 0),
      created_at: new Date(),
      test_name: 'time-perception'
    }
  }
}

export class VerbalMemoryPayload implements IGamePayload {
  getPayload(props: { level: number }) {
    return {
      score: props.level,
      created_at: new Date(),
      test_name: 'verbal-memory'
    }
  }
}

export class VisualMemoryPayload implements IGamePayload {
  getPayload(props: { level: number }) {
    return {
      score: props.level - 1,
      created_at: new Date(),
      test_name: 'visual-memory'
    }
  }
}