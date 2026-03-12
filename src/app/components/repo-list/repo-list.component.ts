import { Component, OnInit } from '@angular/core';
import { GithubService, Repository, SortField } from '../../services/github.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {
  readonly username = environment.githubUsername;

  allRepos: Repository[] = [];
  filteredRepos: Repository[] = [];
  loading = true;
  error: string | null = null;

  sortField: SortField = 'score';
  languageFilter = 'All';
  languages: string[] = ['All'];

  constructor(private github: GithubService) {}

  ngOnInit(): void {
    this.github.getRepositories(this.username).subscribe({
      next: repos => {
        this.allRepos = this.github.sortRepositories(repos, this.sortField);
        this.languages = ['All', ...Array.from(new Set(
          repos.filter(r => r.language).map(r => r.language as string)
        )).sort()];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load repositories. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSortChange(field: SortField): void {
    this.sortField = field;
    this.allRepos = this.github.sortRepositories(this.allRepos, field);
    this.applyFilter();
  }

  onLanguageChange(lang: string): void {
    this.languageFilter = lang;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredRepos = this.languageFilter === 'All'
      ? this.allRepos
      : this.allRepos.filter(r => r.language === this.languageFilter);
  }

  /** Returns true if the repository is the highest-scoring one in the current view. */
  isTopRanked(repo: Repository, index: number): boolean {
    return index === 0 && (repo.score ?? 0) > 0;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
