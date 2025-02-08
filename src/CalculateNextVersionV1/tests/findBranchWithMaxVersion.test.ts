// FILEPATH: /d:/devel/github/azure_devops_versioning_tasks/src/CalculateNextVersionV1/branchVersionUtils.test.ts
import 'jest';
import { findBranchWithMaxVersion } from './../branchVersionUtils';
import * as child_process from 'child_process';
import * as semver from 'semver';

jest.mock('child_process');
jest.mock('semver');

describe('findBranchWithMaxVersion', () => {
  it('should return "0.0.0" if no branch matches the pattern', () => {
    (child_process.execSync as jest.Mock).mockReturnValue(Buffer.from('origin/feature/1.2.3\norigin/bugfix/1.2.4\n'));
    expect(findBranchWithMaxVersion('release/*')).toBe('0.0.0');
  });

  it('should return the maximum version among the branches that match the pattern', () => {
    (child_process.execSync as jest.Mock).mockReturnValue(Buffer.from('origin/release/1.2.3\norigin/release/1.2.4\n'));
    (semver.valid as jest.Mock).mockReturnValue(true);
    (semver.gt as jest.Mock).mockImplementation((a: string, b: string) => a > b);
    expect(findBranchWithMaxVersion('release/*')).toBe('1.2.4');
  });

  it('should ignore branches with invalid version', () => {
    (child_process.execSync as jest.Mock).mockReturnValue(Buffer.from('origin/release/1.2.3\norigin/release/invalid\n'));
    (semver.valid as jest.Mock).mockImplementation((version: string) => version !== 'invalid');
    (semver.gt as jest.Mock).mockImplementation((a: string, b: string) => a > b);
    expect(findBranchWithMaxVersion('release/*')).toBe('1.2.3');
  });
});