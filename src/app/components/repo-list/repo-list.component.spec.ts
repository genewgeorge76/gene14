import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RepoListComponent } from './repo-list.component';
import { GithubService, Repository } from '../../services/github.service';

const mockRepos: Repository[] = [
  {
    id: 1, name: 'top-repo', full_name: 'user/top-repo', html_url: 'https://github.com/user/top-repo',
    description: 'My top repo', stargazers_count: 20, forks_count: 10,
    language: 'TypeScript', updated_at: '2024-03-01T00:00:00Z',
    topics: ['angular'], visibility: 'public', homepage: null, open_issues_count: 1, score: 80
  },
  {
    id: 2, name: 'other-repo', full_name: 'user/other-repo', html_url: 'https://github.com/user/other-repo',
    description: null, stargazers_count: 2, forks_count: 1,
    language: 'JavaScript', updated_at: '2024-01-01T00:00:00Z',
    topics: [], visibility: 'public', homepage: null, open_issues_count: 0, score: 8
  }
];

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let githubSpy: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    githubSpy = jasmine.createSpyObj('GithubService', ['getRepositories', 'sortRepositories']);
    githubSpy.getRepositories.and.returnValue(of(mockRepos));
    githubSpy.sortRepositories.and.returnValue(mockRepos);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RepoListComponent],
      providers: [{ provide: GithubService, useValue: githubSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repositories on init', () => {
    expect(githubSpy.getRepositories).toHaveBeenCalledWith('genewgeorge76');
    expect(component.loading).toBeFalse();
    expect(component.allRepos.length).toBe(2);
  });

  it('should populate language list', () => {
    expect(component.languages).toContain('TypeScript');
    expect(component.languages).toContain('JavaScript');
    expect(component.languages[0]).toBe('All');
  });

  it('should filter by language', () => {
    component.onLanguageChange('TypeScript');
    expect(component.filteredRepos.every(r => r.language === 'TypeScript')).toBeTrue();
  });

  it('should show all repos when language is All', () => {
    component.onLanguageChange('TypeScript');
    component.onLanguageChange('All');
    expect(component.filteredRepos.length).toBe(2);
  });

  it('should display error on API failure', () => {
    githubSpy.getRepositories.and.returnValue(throwError(() => new Error('API error')));
    component.ngOnInit();
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('isBestForPublish should return true only for first item with score > 0', () => {
    expect(component.isTopRanked(mockRepos[0], 0)).toBeTrue();
    expect(component.isTopRanked(mockRepos[1], 1)).toBeFalse();
    expect(component.isTopRanked({ ...mockRepos[0], score: 0 }, 0)).toBeFalse();
  });

  it('formatDate should return a readable date string', () => {
    const result = component.formatDate('2024-03-01T00:00:00Z');
    expect(result).toContain('2024');
  });
});
