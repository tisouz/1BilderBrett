from rest_framework import serializers

from imageBoard.models import Post

class VotePostSerializer(serializers.Serializer):
    post = serializers.IntegerField()
    action = serializers.CharField(max_length=4)

    def validate_post(self, value):
        if Post.objects.filter(id=value).exists():
            return value
        else:
            raise serializers.ValidationError("Post doesn't exist")

    def validate_action(self, value):
        action = value.lower()
        if action == 'up' or action == 'down' or action == 'del':
            return action
        else:
            raise serializers.ValidationError(["Invalid action, valid actions: up, down, del"])

    def save(self):
        user = self.context['request'].user.id
        post = Post.objects.get(pk=self.validated_data['post'])
        action = self.validated_data['action']

        if action == 'up':
            post.votes.up(user)
        elif action == 'down':
            post.votes.down(user)
        else:
            post.votes.delete(user)

        return self.validated_data
