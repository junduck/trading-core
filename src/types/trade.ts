/**
 * Strategy for determining which lots to close when reducing a position.
 * - FIFO: First In, First Out - closes the oldest lots first
 * - LIFO: Last In, First Out - closes the newest lots first
 * @group Position
 */
export type CloseStrategy = "FIFO" | "LIFO";
