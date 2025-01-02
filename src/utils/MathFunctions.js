
export const transform2DCoords = (
    coords, // location array [x, y]
    translation, // translation array [tx, ty]
    scale, // scale array [sx, sy]
    rotation // rotation in degrees
) => {
    // Extract values for better readability
    const [x, y] = coords;
    const [tx, ty] = translation;
    const [sx, sy] = scale;

    // Convert rotation from degrees to radians
    const radians = (rotation * Math.PI) / 180;

    // Step 1: Apply scaling
    let scaledX = x / sx;
    let scaledY = y / sy;

    // Step 2: Apply rotation (around origin)
    const rotatedX = scaledX * Math.cos(radians) - scaledY * Math.sin(radians);
    const rotatedY = scaledX * Math.sin(radians) + scaledY * Math.cos(radians);

    // Step 3: Apply translation
    const translatedX = rotatedX + tx;
    const translatedY = rotatedY + ty;

    return [translatedX, translatedY];
};

export const applyTransformationMatrix = (
    position, // [x, y] - original position
    scale, // [sx, sy] - scaling factors
    transformationMatrix // 3x3 transformation matrix
) => {
    const [x, y] = position;
    const [sx, sy] = scale;

    // Step 1: Scale the position
    const scaledX = x / sx;
    const scaledY = y / sy;

    // Step 2: Apply the transformation matrix
    // Transformation Matrix Structure:
    // | a  b  tx |
    // | c  d  ty |
    // | 0  0  1  |

    const a = transformationMatrix[0][0];
    const b = transformationMatrix[0][1];
    const tx = transformationMatrix[0][2];
    const c = transformationMatrix[1][0];
    const d = transformationMatrix[1][1];
    const ty = transformationMatrix[1][2];

    const transformedX = a * scaledX + b * scaledY + tx;
    const transformedY = c * scaledX + d * scaledY + ty;

    // Step 3: Return the transformed position
    return [transformedX, transformedY];
};
