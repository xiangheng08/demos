import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { isAbsolute, join, relative } from 'node:path'

/**
 * 检测 path 是否为目录
 */
export const isDirectory = (path: string) => {
  if (!existsSync(path)) return false
  try {
    return statSync(path).isDirectory()
  } catch (_) {
    return false
  }
}

/**
 * 检测 path 是否为文件
 */
export const isFile = (path: string) => {
  if (!existsSync(path)) return false
  try {
    return statSync(path).isFile()
  } catch (_) {
    return false
  }
}

/**
 * 判断 childPath 是否是 parentPath 的子路径
 */
export const isSubPath = (parentPath: string, childPath: string, notSelf = true) => {
  if (!isAbsolute(parentPath) || !isAbsolute(childPath)) {
    throw new Error('Both paths must be absolute paths')
  }
  const relativePath = relative(parentPath, childPath)
  if (notSelf && relativePath === '') return false
  return !relativePath.startsWith('..') && !isAbsolute(relativePath)
}

export const copyDirRecursive = (src: string, dest: string) => {
  // 确保目标目录存在
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }

  // 读取源目录内容
  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDirRecursive(srcPath, destPath)
    } else {
      // 复制文件
      copyFileSync(srcPath, destPath)
    }
  }
}

export const debounce = <T extends any[], R>(
  fn: (...args: T) => R,
  wait?: number,
): ((...args: T) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
