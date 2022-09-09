import { registerDecorator, ValidationArguments } from 'class-validator';

export function IsNumber() {
  return function (object: { constructor: any }, propertyName: string) {
    registerDecorator({
      name: 'IsNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} is not a number`,
      },
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const { object, value } = args;

          if (typeof value != 'string') return false;

          if (typeof value === 'number') return true;

          const number = parseFloat(value);
          if (!isNaN(number)) {
            object[propertyName] = number;
            return true;
          }

          return false;
        },
      },
    });
  };
}
