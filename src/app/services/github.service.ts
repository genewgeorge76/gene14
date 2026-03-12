import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  visibility: string;
  homepage: string | null;
  open_issues_count: number;
  score?: number;
}

export type SortField = 'stars' | 'forks' | 'updated' | 'score';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly apiBase = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  /**
   * Fetches public repositories for the given GitHub user.
   * Each repository is enriched with a `score` field (3×stars + 2×forks).
   *
   * @param username  GitHub username whose public repositories to retrieve.
   * @param perPage   Maximum number of repositories to return (default 100).
   * @returns         Observable that emits the array of enriched repositories,
   *                  or errors if the API request fails.
   */
  getRepositories(username: string, perPage: number = 100): Observable<Repository[]> {
    const params = new HttpParams()
      .set('per_page', perPage.toString())
      .set('type', 'public')
      .set('sort', 'updated');
    return this.http
      .get<Repository[]>(`${this.apiBase}/users/${username}/repos`, { params })
      .pipe(
        map(repos => repos.map(repo => ({
          ...repo,
          score: this.computeScore(repo)
        })))
      );
  }

  private computeScore(repo: Repository): number {
    return repo.stargazers_count * 3 + repo.forks_count * 2;
  }

  sortRepositories(repos: Repository[], field: SortField): Repository[] {
    return [...repos].sort((a, b) => {
      switch (field) {
        case 'stars':   return b.stargazers_count - a.stargazers_count;
        case 'forks':   return b.forks_count - a.forks_count;
        case 'updated': return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'score':
        default:        return (b.score ?? 0) - (a.score ?? 0);
      }
    });
  }
}
