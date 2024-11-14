import { body, validationResult } from 'express-validator';

export const validateMallTransaction = [
  body('items')
    .isArray()
    .withMessage('Los items deben ser un array')
    .notEmpty()
    .withMessage('Debe incluir al menos un item'),
  
  body('items.*.amount')
    .isNumeric()
    .withMessage('El monto debe ser un número válido')
    .custom(value => value > 0)
    .withMessage('El monto debe ser mayor a 0'),
  
  body('items.*.storeIndex')
    .isInt({ min: 0 })
    .withMessage('El índice de la tienda debe ser un número válido'),
  
  body('orderId')
    .isString()
    .withMessage('El ID de orden debe ser una cadena de texto')
    .matches(/^[a-zA-Z0-9|_=&%.,~:/?[+!@()>-]+$/)
    .withMessage('El ID de orden contiene caracteres no válidos')
    .isLength({ max: 26 })
    .withMessage('El ID de orden no puede exceder 26 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];