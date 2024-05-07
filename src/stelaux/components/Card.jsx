import { Card, Metric, Text } from '@tremor/react';
import classNames from 'classnames';

export function CardUsageExample({ className, name }) {
  const classes = classNames('mx-auto max-w', className);
  return (
    <Card
    className={classes}
      decoration="top"
      decorationColor="indigo"
    >
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{name}</p>
      <p className="text-tremor-content-strong lg:text-3xl dark:text-dark-tremor-content-strong font-semibold">$34,743</p>
    </Card>
  );
}