from django.core.management.base import BaseCommand
from ...models import WordPool

DEFAULT_WORDS = [
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape",
    "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "pear",
    "quince", "raspberry", "strawberry", "tangerine", "watermelon",
    "apricot", "blueberry", "cantaloupe", "dragonfruit", "grapefruit",
    "lime", "melon", "olive", "peach", "pineapple", "plum"
]


class Command(BaseCommand):
    help = 'Populates the WordPool with default words'

    def handle(self, *args, **options):
        created_count = 0
        for word in DEFAULT_WORDS:
            _, created = WordPool.objects.get_or_create(word=word)
            if created:
                created_count += 1

        if created_count > 0:
            self.stdout.write(self.style.SUCCESS(f'Successfully added {created_count} words to the pool'))
        else:
            self.stdout.write('Word pool already contains all default words')