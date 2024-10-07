setup: # install pre-commit hooks
	pip3 install pre-commit black isort pylint
	pre-commit install
	pre-commit run --all-files