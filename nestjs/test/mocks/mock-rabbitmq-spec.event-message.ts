/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unnecessary-type-assertion */
import { jest } from '@jest/globals';
import { Module } from '@nestjs/common';

@Module({})
class MockModule {}

jest.unstable_mockModule('@golevelup/nestjs-rabbitmq', () => {
  console.log('SUCCESSFULLY MOCKED RABBITMQ LIB');
  const originalModule = jest.requireActual(
    '@golevelup/nestjs-rabbitmq',
  ) as any;

  return {
    ...originalModule,
    RabbitMQModule: {
      forRootAsync: jest.fn(() => MockModule),
    },
    AmqpConnection: jest.fn().mockImplementation(() => ({
      publish: jest.fn().mockImplementation(() => {
        console.log('Message published via RabbitMQ mocks');
      }),
      request: jest.fn().mockImplementation(() => {
        console.log('Message requested via RabbitMQ mocks');
        return true;
      }),
    })),
  };
});

export default {};
