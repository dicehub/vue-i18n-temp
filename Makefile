PRE_COMMIT_PACKAGE=pre-commit
PRE_COMMIT_CMD=pre-commit

repo-init:
	$(MAKE) init-git-hooks

init-git-hooks:
	pip3 -v >/dev/null 2>&1 pip3 install $(PRE_COMMIT_PACKAGE) || pip install $(PRE_COMMIT_PACKAGE)
	$(PRE_COMMIT_CMD) install
