import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubService, Repository } from './github.service';

const mockRepos: Repository[] = [
  {
    id: 1, name: 'repo-a', full_name: 'user/repo-a', html_url: '', description: null,
    stargazers_count: 10, forks_count: 5, language: 'TypeScript',
    updated_at: '2024-01-01T00:00:00Z', topics: [], visibility: 'public', homepage: null,
    open_issues_count: 0
  },
  {
    id: 2, name: 'repo-b', full_name: 'user/repo-b', html_url: '', description: 'A repo',
    stargazers_count: 3, forks_count: 10, language: 'JavaScript',
    updated_at: '2024-06-01T00:00:00Z', topics: [], visibility: 'public', homepage: null,
    open_issues_count: 2
  }
];

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch repos and attach scores', () => {
    service.getRepositories('testuser').subscribe(repos => {
      expect(repos.length).toBe(2);
      // repo-a: 10*3 + 5*2 = 40
      expect(repos.find(r => r.name === 'repo-a')?.score).toBe(40);
      // repo-b: 3*3 + 10*2 = 29
      expect(repos.find(r => r.name === 'repo-b')?.score).toBe(29);
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/testuser/repos'));
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should sort by stars descending', () => {
    const sorted = service.sortRepositories(mockRepos, 'stars');
    expect(sorted[0].name).toBe('repo-a');
  });

  it('should sort by forks descending', () => {
    const sorted = service.sortRepositories(mockRepos, 'forks');
    expect(sorted[0].name).toBe('repo-b');
  });

  it('should sort by score descending', () => {
    const withScores = mockRepos.map(r => ({
      ...r, score: r.name === 'repo-a' ? 40 : 29
    }));
    const sorted = service.sortRepositories(withScores, 'score');
    expect(sorted[0].name).toBe('repo-a');
  });
});
