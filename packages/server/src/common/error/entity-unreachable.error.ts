export class EntityUnreachableError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID ${id} 不存在或已删除，无法执行操作`);
    this.name = 'EntityDeletedError';
  }
}
